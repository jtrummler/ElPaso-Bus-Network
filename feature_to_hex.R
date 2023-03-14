# add tract to hex bins

st_write(hex, "hex.geojson")

ggplot()+
  geom_sf(data = elpaso, fill= NA, color = 'red')+
  geom_sf(data=  hex, fill = NA)

