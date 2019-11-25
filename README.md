# demers-au
Demers cartogram of Australia using a D3 force directed graph

## Inspiration
Chris Given has useful Block showing a Demers cartogram built with D3. It's visualizing population by US state between 1900 and 2010. [The block is here](https://bl.ocks.org/cmgiven/9d6bc46cf586738458c13dd2b5dadd84).

### Is it really a Demer's Cartogram?
Chris notes in his block that:
>Note that I am continuing to use the geographic position of each state to gently prod the map into a recognizable shape, so this may not be a strict Demers.

Since I'm using a take on Chris' code, I guess this may not be a strict Demers either. 

Chris refers to the [arcgis.com webpage](https://www.arcgis.com/home/item.html?id=d1663c61ba2843f78cec5286a4c7a1c6) for a definition:

>The Demers Cartogram is a technique for representing data for areas that eschews geography in preference for a geometric shape that represents the unit areas. It is ostensibly the same as a Dorling cartogram except it uses squares instead of circles to reduce the gaps between mapped objects.

>A Demers cartogram maintains neither shape, topology or object centroids and is an abstract representation of the spatial pattern of the phenomena being mapped. However, whereas the Dorling cartogram attempts to limit the distance of the eventual position of each object from its original position, the Demers sacrifices distance to maintain contiguity. The positions of areas are moved to deal with the problem of overlapping objects caused by some non contiguous cartograms.

So, to me it seems the point of using a force directed graph to simulate the Demers output is:

* Adjacent polygons should be attracted to one another 
* Geography is a factor in the eventual layout

Maintaining some link to the underlying geography is a mitigating factor for this later point in the arcgis.com webpage:

>The drawback is that the distortions and abstract portrayal can be a hurdle for some in their understanding.

Nit-pickers may understandably want to re-title this page as *Demers-like cartogram etc*

## Trying it out for Australia
Australian geography can be obtained from the ABS and for this exercise, I used the Commonwealth Electoral Division file from 2018 which is available [here](https://www.abs.gov.au/AUSSTATS/abs@.nsf/DetailsPage/1270.0.55.003July%202018?OpenDocument). 

[Mapshaper](https://mapshaper.org/) can be used to convert to geojson format and to simplify the geography down to 1 percent.

I've prepared a pre-computed set of nodes and links for the force directed graph approach. I've also included the code to compute those outputs but it's a bit slow. We need to end up with:

* list of divisions with name, latitude, longitude and other attributes e.g. population
* list of neighbours - this is derived by iterating over the geojson features with turf.js and using the intersect function for the neighbourhood test

Then, the divisions become the nodes of the graph, and the neighbourhood relationships become the edges.

### Why Australia?
Australia is interesting for two reasons - firstly, I live here. Secondly, there are not enough examples on the web of Australian cartograms so I have to make one!

### Is the implementation any good?
Let's take a look at the output with the default settings:
![Default settings](/images/l-1-ns-20-lfs-0.6-cff-1.png)