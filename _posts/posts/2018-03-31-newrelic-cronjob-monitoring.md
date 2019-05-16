---
layout: default
title:  "Newrelic Cronjob Monitoring"
date:   2018-03-31 10:42:55 +1100
permalink: newrelic/newrelic-cronjob-monitoring
category: post
tags:
  - newrelic
  - cronjob
color: EDEDED
comments: true
---

# Newrelic Cronjob Monitoring

<small class="written-by">
  Written by <a href="https://github.com/lukakerr">Luka Kerr</a> on March 31, 2018
</small>

### Setup

To enable cronjob monitoring with Newrelic, two or three files are needed depending on your setup:

- `*.js` (or any file where your cronjob logic is located)
  - Used to execute your cronjob logic
  - Throws error which exits the script early to inform of a failure
- `*.sh`
  - Used to start the `*.js` script.
  - May involve setting environment variables etc
  - If a failure occurs, an event gets sent to Newrelic
  - If your cronjob logic is solely located in a `*.sh` script, the `*.js` script isn't needed and can be skipped below.
- `send_event.sh`
  - Used to send the event to Newrelic

You will also need to create a new alert policy in Newrelic. You can setup the specific conditions here, but essentially it will involve checking if a certain number of failure events have been recorded over a certain time period.

The way the monitoring process works, is that if the `*.js` script throws an error, it's exit code will != 0. The `*.sh` script will perform a bitwise OR with the exit condition and a `EXIT` variable, and at the end of the `*.sh` file, if `EXIT` != 0, a failure has occurred, and a newrelic failure event will be sent. This logic can be modified, for example if you wanted to send an event every execution not just on failure. Event data can be found under the 'Insights' tab in Newrelic.

### Modify `*.js` script(s)

The only extra logic needed in the `*.js` scripts is to throw an error. This is shown below, simply insert this line somewhere in your file where you check for an error.

```javascript
if err
  throw new Error()
```

This will exit with a non-zero exit code. If you have a callback chain, you could only include this error check at the end of that callback chain, such that if an error occurs, it makes it way up the chain, and throws an error.

### Modify `*.sh` script(s)

Previously your `*.sh` script may have looked something like:

```bash
#!/bin/sh

export NODE_ENV="production"
node scripts/cron.js
```

This needs to be modified to look like the following:

```bash
#!/bin/sh

EXIT=0
START=`date +%s`

export NODE_ENV="production"
node scripts/cron.js
EXIT=$(($EXIT | $?)) # bitwise OR

# If exit isnt 0, its failed
if [ $EXIT -ne 0 ]; then
  echo "Cronjob failed - sending newrelic event"

  STATUS="failure"
  NAME=`basename "$0"`
  END=`date +%s`
  RUNTIME="$((END-START))s"

  # Send failure event after cronjob has run
  # Be sure to correct this path when adding the send_event.sh script below
  ../newrelic/send_event.sh $STATUS $NAME $RUNTIME
fi
```

**Note:** if the shell script has multiple `*.js` scripts running one after the other, then the bitwise OR (`EXIT=$(($EXIT | $?)) # bitwise OR`) needs to be inserted at the next line after **each** script.

### Add `send_event.sh`

Create a file named `send_event.sh` with the following inside. Be sure to change both the `INSERT_KEY` and `EVENT_URL` to match your account.

```bash
# Send an event to newrelic from cronjob output
# Pass arguments which define the JSON to send as the event:
# ./send_event.sh success some_script.sh 25s

EVENT=$1      # e.g: "success"
CRON_NAME=$2  # e.g: "some_script.sh"
EXEC_TIME=$3  # e.g: "25s"

JSON=$(cat <<EOF
[
  {
    "eventType":"Cronjob $EVENT",
    "cronjobName":"$CRON_NAME",
    "executionTime":"$EXEC_TIME"
  },
]
EOF
)

INSERT_KEY=abcdefGHIJKlmnopqRSTUVwxyz
EVENT_URL=https://insights-collector.newrelic.com/v1/accounts/123456/events

# Send event
echo $JSON | curl -d @- -X POST -H "Content-Type: application/json" -H "X-Insert-Key: $INSERT_KEY" $EVENT_URL
```

Thats it. To add your email to the policy's notifications, go to the policy notification settings and add a notification channel.