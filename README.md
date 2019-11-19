# demers-au
Demers cartogram using D3 force directed graph

## Inspiration
Chris Given has useful Block showing a Demers cartogram built with D3. It's visualizing population by US state between 1900 and 2010. [The Block is here](https://bl.ocks.org/cmgiven/9d6bc46cf586738458c13dd2b5dadd84).

## Trying it out for Australia
Australian geography is easily obtained from the ABS and for this exercise, I used the Commonwealth Electoral Division file from 2018. Further, using mapshaper to simplify the geography down to 1 percent.

The code has a pre-computed set of nodes and links for the force directed graph approach and also includes the code to compute that graph. We need to end up with:

* list of divisions with name, latitude, longitude and other attributes e.g. population
* list of neighbours - this is derived by iterating over the geojson features with turf.js and using the intersect function for the neighbourhood test

Then, the divisions become the nodes of the graph, and the neighbourhood relationships become the edges.
