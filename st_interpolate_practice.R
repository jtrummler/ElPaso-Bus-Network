## st_interpolate_aw()


ggplot(acs_ep)+
  geom_sf()

mapview(acs_ep %>% dplyr::select(c('totalPop')))




hex1 <- st_make_grid(elpaso_outline, 
                    cellsize = .005, 
                    crs = 4269, 
                    square = F) %>% 
  st_sf() 


hex1 <- hex1[elpaso_outline,] %>%
  mutate(uniqueID = rownames(.))


hex_inter <- st_interpolate_aw(acs_ep[c("totalPop","whitePop")], hex1, extensive = T) 

mapview(hex_inter)

