<h1 align="center">ugonnawin-slash-commands</h1>


# Commands:

<i>*anything enclosed in square brackets is a variable, ex: [this_is_a_variable]</i>

 - ### `/link [url]` -or- `/l [url]`
   - Creates neat links instead of the default, bulky Slack unfurled links
   - `/l [url]` is shorthand for `/link [url]`
   - Example: `/link google.com`
   - Example: `/l google.com`
   
 - ### `/lb [url]`
   - Creates links as buttons via Slack '[blocks](https://api.slack.com/reference/messaging/blocks)'
   - Same as `/link [url]` or `/l [url]`, only the link is in the form of a button and overflow is cut off at 75 chars

 - ### `/weather [city] [zip] [city,CN] [zip,CN]`
   - #### Use `/weather -h` for help!
   - Where CN is a Country Code
   - Takes a city name or zip code or city plus country code or zip plus Country Code
   - No space allowed between city/zip and Country Code
   - Must be separated by a comma - no spaces allowed between city/zip, comma, and Country Code

 - ### `/save [text]`
   - Saves a message

 - ### `/getsaved`
   - Returns all saved messages
