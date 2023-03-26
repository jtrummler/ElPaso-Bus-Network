# add tract to hex bins

#st_write(hex, "hex.geojson")

ggplot()+
  geom_sf(data = elpaso, fill= NA, color = 'red')+
  geom_sf(data = hex, fill = NA)


#vars <- 

## count should be normalized by area
## but averages or proportions can go right through

hex1 <- hex %>% st_centroid() %>% st_join(elpaso, join=st_within) %>% 
  st_drop_geometry() %>% 
  full_join(., hex) %>% st_sf() %>% 
  select(uniqueID, NAME, med_HH_Income.2020, pctWhite.2020, pctUnder18.2020, pop_dense)


ggplot(hex1)+
  geom_sf(aes(fill = pop_dense), color = NA)


final_hex <- left_join(ridership_net, st_drop_geometry(hex1), by = "uniqueID")

m1 <- lm(formula = ridership ~ med_HH_Income.2020 + pctWhite.2020 + pctUnder18.2020 + pop_dense,
         data = final_hex)

m1 %>% summary()
