#economic data 

#devtools::install_github("jamgreen/lehdr")
library(tidyverse)
library(sf)
library(lehdr)
library(tidycensus)

tx_work <- grab_lodes(state = "tx", year = 2019, lodes_type = "wac", job_type = "JT01", 
                    segment = "S000", state_part = "main", agg_geo = "tract")
elpaso_work <- left_join(elpaso, tx_work, by = c('GEOID' = 'w_tract')) %>% st_sf()


tx_reside <- grab_lodes(state = "tx", year = 2019, lodes_type = "rac", job_type = "JT01", 
                      segment = "S000", state_part = "main", agg_geo = "tract")



elpaso <- get_acs(geography = "tract",
                  year = 2020, 
                  variables = "B01001_001E", 
                  geometry = T,
                  state = "TX", 
                  county = "El Paso", 
                  output = "wide") 


elpaso_reside <- left_join(elpaso, tx_reside, by = c('GEOID' = 'h_tract')) %>% st_sf()

ggplot(elpaso_work)+
  geom_sf(aes(fill = C000), color = NA)

ggplot(elpaso_reside)+
  geom_sf(aes(fill = C000), color = NA)

