import geopandas as gpd
import pandas as pd
import matplotlib.pyplot as plt

transit_stops = gpd.read_file('C:/Users/jtrum/pennmusa/MUSA8010/repository/data/ridership.geojson')
transit_stops = transit_stops.to_crs(epsg=4269)
transit_stops

final_hex = gpd.read_file('C:/Users/jtrum/pennmusa/MUSA8010/repository/ElPaso-Bus-Network/final_hex4.geojson')
final_hex = final_hex.to_crs(epsg=4269)
final_hex

routes_to_hex = gpd.overlay(transit_stops, final_hex, how='intersection')

# Plot the route
fig, ax = plt.subplots(figsize=(10,10))
routes_to_hex.plot(ax=ax, color='red', markersize=1)
plt.show()

# Get the hexagon IDs for every hexagon that intersects with the route, and only include the left side of the join
joined = gpd.sjoin(final_hex, routes_to_hex, how='inner', predicate='intersects')
joined.head()

# Select only the columns we want
joined = joined[['RT', 'ridership_per_stop_left', 'pred_ridership_per_stop_left', 'whitePop_left', 'blackPop_left', 'asianPop_left', 'hlPop_left', 'otherRacePop_left', 'nhPop_left', 'aiPop_left', 'disability_left', 'medHHInc_left', 'employmentHHMix_left']]
joined

# Aggregation of the data
joined = joined.groupby('RT').agg({'ridership_per_stop_left': 'sum', 'pred_ridership_per_stop_left': 'sum', 'whitePop_left': 'mean', 'blackPop_left': 'mean', 'asianPop_left': 'mean', 'hlPop_left': 'mean', 'otherRacePop_left': 'mean', 'nhPop_left': 'mean', 'aiPop_left': 'mean', 'disability_left': 'sum', 'medHHInc_left': 'mean', 'employmentHHMix_left': 'mean'})
joined.head(61)