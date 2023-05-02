# down town map




buildings <- read_sf(paste(data_folder, "/BuildingFootPrint.geojson", sep = '')) 
parks <- read_sf(paste(data_folder, "/Parks.geojson", sep = ''))
roads <- read_sf(paste(data_folder, "/roads_filtered.geojson", sep = ''))
briolines<-  read_sf(paste(data_folder, "/Brio.shp", sep = '')) %>% st_transform(crs = 4326)



bounds <- c(ymin = 31.75, ymax = 31.763, xmin = -106.495, xmax = -106.475)

builds <- buildings %>% st_crop(y = bounds)
park <- parks %>% st_crop(y = bounds)
road <- roads %>% st_crop(y = bounds)
brio <- briolines %>% st_crop(y = bounds)
hex <- final_hex %>% st_crop(y = bounds)


ggplot()+
  geom_sf(data= builds, color = NA)+
  geom_sf(data = park, color = NA, fill = 'lightgreen')+
  geom_sf(data = road, color = 'lightgrey', alpha = .5)+
  geom_sf(data = brio, size = 1.5, aes(color = Name), alpha= .7)+ 
  geom_sf(data = hex, fill = 'NA')+
  mapTheme+
  scale_color_manual(values = c('#B0C72C','#660066','#00A8E7'))

### add river
#-and ped corssing
## show jobs somehow
##inset map 
##highways?
##rail?
## scale 