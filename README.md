# demers-au
Demers cartogram of Australia using a D3 force directed graph. The demo is [here](https://robinmackenzie.github.io/demers-au/).

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

[Mapshaper](https://mapshaper.org/) can be used to convert to geojson format and to simplify the geography down to 1 percent. Then we need to join other data to this and in this case I used the 2017 population estimates also sourced from the ABS.

I've prepared a pre-computed set of nodes and links for the force directed graph approach. I've also included the code to compute those outputs but it's a bit slow. We need to end up with:

* list of divisions with name, latitude, longitude and other attributes i.e. population
* list of neighbours - this is derived by iterating over the geojson features with turf.js and using the intersect function for the neighbourhood test

Then, the divisions become the nodes of the graph, and the neighbourhood relationships become the edges.

### Why Australia?
Australia is interesting for two reasons - firstly, I live here. Secondly, there are not enough examples on the web of Australian cartograms so I have to make one!

## Is the implementation any good?

Let's reserve judgement and see a few examples instead...

### Default settings
Let's take a look at the output with the default settings. If you're familiar with Australia and know in advance that this is supposed to be a cartogram then with a stretch of imagination then Queensland, New South Wales, Australia Capital Territory (ACT), Victoria and Tasmania are in the right sort of place with kinda-sorta the right shape. South Australia, Northern Territory and Western Australia are leaving something to be desired:

![Default settings](/images/l-1-ns-20-lfs-0.6-cff-1.png)

Note that some nodes are slightly bigger than others - e.g. SE NSW and Tasmania. The min and max of the population data is 102,079 and 223,820. 

### Remove the links
The option to remove links will empty the edges of the graphs which negates some of the effect of using a force directed graph (the attraction). Rather pleasingly, we still retain the effect (the repulsion) which stops the nodes overlapping each other:

![Default settings - no links](/images/l-0-ns-20-lfs-0.6-cff-1.png)

This is essentially anti-Demers (or quasi-Demers?) in that we have sacrificed contiguity to retain distance. However, for the large states of New South Wales, Queensland and Victoria, we have managed to get some sense of their 'spread' without losing their 'shape'.

Leaving links off, and reducing node size to 16 and the collision force factor to 0.7 we get this:

![No links, node size 16, link force strength 0.6, collision force factor 0.7](/images/l-0-ns-16-lfs-0.6-cff-0.7.png)

Similar to the other example with no edges, we get the overall *impression* of Australia, retaining the force-repulsed divisions of NSW, QLD and VIC in somewhat reasonable configuration. We have problems with the Victorian divisions of Bruce (south of Tasmania), Aston and Calwell (dislocated into NSW).

### Increasing the link force strength
If we triple the size of the link force strength parameter and retain the other defaults (no point turning links off and playing with this parameter) the output 'clumps' more and we see WA, NT and SA connect up. The topology of the states is somewhat preserved. Overall, this is less recognizable as Australia than previous examples:

![Default settings - link force strength 1.8](/images/l-1-ns-20-lfs-1.8-cff-1.png)

Further, reducing the node size to 19 and the collision force factor to 0.6 'rounds out' the above example, keeping the states in somewhat the right place:

![Links on, node size 19, link force strength 1.8, collision force factor 0.6](/images/l-1-ns-19-lfs-1.8-cff-0.6.png)

### Conclusion

Of the truer-to-Demers examples, my personal preference is the last. I can see this as a reasonable choice for some thematic map. Further to the comments in Chris' block, I can also see the utility of manually cutting out some edges to tweak the output e.g. NW NSW is straying into QLD a little too much.

Of the not-so-true-to-Demers examples, my preference is the first. Aston would need to be tweaked to rejoin it with the rest of Victoria.

