# kult_dma_fix_thumbnails
Fixes thumbnail cache for the denkmalatlas result list.

It is a simple webpage, that you can open in every browser. When your IP has access to the project solr, it will first request a list of all obects with an thumnail image. Then the script creates an image object for each thumbnail and if this leads to an error, a url is used that ignores/rebuild the cache entry for this image.
