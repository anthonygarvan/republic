# Republic: A democratic microservice governance platform (WIP)

Republic is an implementation of a representative democracy in the domain of enterprise software architecture. It is a highly scalable microservice platform that overcomes the flaws of authoritarian monoliths and tribal microservices, providing loose coupling between services while enabling rapid infrastructure improvements. The governing code itself can be edited by collaborators elected by service contributors, ensuring incentives for change and longevity. Built on top of [nodejs](https://nodejs.org/), the [github API](https://developer.github.com/v3/), [RAML](http://raml.org/index.html), and [the idea of representative democracy](https://en.wikipedia.org/wiki/Republic).  

The motivation for a democratic architecture for large scale systems is the same as that for democracy itself: monolithic monarchies are characterized by periods of easy, rapid expanse, followed by brief euphoria, and then decay and inevitable collapse or violent revolution. Tribal, poorly regulated services, on the other hand, never experience violent revolution but are limited in their rate of change, as it is nearly impossible to enforce large scale infrastructural improvements and regulation. Democracy, messy though it may be, occupies a nice middle ground characterized by continuous evolution and periodic, peaceful revolution.  

But why have a representational government for microservices? Shouldn't important architecture decisions be made by some benevolent architect? A few reasons. One great thing about representative democracy is that there is no single point of failure. Reliance on a single individual or team, no matter how well intentioned and talented, will lead to brittleness and lack of motivation. A long running project should run on ideas and documents, not on people or teams. Another great thing about representation is elections. Elections mean those who have power are constantly kept on their toes and forced to prove their value. Furthermore, it means buy-in from the contributors, who would otherwise get disgruntled, resist change, and resent the costs of membership.

In it's implementation, Republic is a web service that validates other web services ("citizens") according to features they must implement according to their citizen types. Just like governments operate on entities (private citizens, states, corporations, etc.), so too Republic is designed to validate that a web service comply with protocols and implement behavior according to their citizen types. The base government API supports basic operations around citizenship, elections, and regulations.

## Government API
citizenship/apply?url={url}&citizen_types={string}
citizenship/addmember?citizen_id={citizen_id}&member_username={username}
citizenship/status?url
citizenship/all
citizenship/search?query={query_string}
election/representatives/list
election/vote/representative/username={name}&position={title}
electron/runforoffice/username={}&position={title}&platform={url}
regulation/enforce/all
regulation/enforce?url={url}
regulation/enforce?entitytype={string}
government/isalive

## Person API
person/isalive

## Citizen API
citizen/name
citizen/description
citizen/logthis/{string}
citizen/getlogs
citizen/pleasevote

## Government Positions
owner(s)
puller
supporter

## Other Design Objectives
- easy migration path from either monolithic apps or tribal microservices
- opt in or opt out at any time, both at an individual and organizational level

## Setup
git clone https://github.com/anthonygarvan/republic.git
cd republic
npm install

Then, you will need to enter your github account information in github_config.yaml

node gov.js

```"Democracy is the worst idea for a software architecture, except for all the others."```
