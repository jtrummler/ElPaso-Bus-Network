import geopandas as gpd
import matplotlib.pyplot as plt

transit_stops = gpd.read_file('./data/transit_stops.geojson')
transit_stops = transit_stops.to_crs(epsg=4269)

final_hex = gpd.read_file('./ElPaso-Bus-Network/final_hex3.geojson')
final_hex = final_hex.to_crs(epsg=4269)

# Select one route to test
route2 = transit_stops[transit_stops['id'] == '2']

# Intersect route with hexagons
route2_hex = gpd.overlay(route2, final_hex, how='intersection')

route2_hex.head()

