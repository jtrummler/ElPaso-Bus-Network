import functions_framework
import geopandas as gpd
import pathlib


# To allow POST requests from any origin, we include the following headers on
# any response that this server sends.
PERMISSIVE_CORS_HEADERS = {'Access-Control-Allow-Origin': '*'}

CURDIR = pathlib.Path(__file__).parent.resolve()


@functions_framework.http
def calc_network_bins(request):
    # Browsers will send an OPTIONS request before sending a POST request. All we
    # need to do for the OPTIONS request is respond with the appropriate headers.
    # You can safely ignore this if clause (but keep it here).
    if request.method == 'OPTIONS':
        return ('', 204, PERMISSIVE_CORS_HEADERS)

    # === FOR ALL OTHER TYPES OF REQUESTS...

    # Get the network_kml file from the request's form data.
    network_kml = request.files.get("network_kml").stream
    network_gdf = gpd.read_file(network_kml)

    # Get the hexbins.
    hexbins_gdf = gpd.read_file(CURDIR / "final_hex.geojson")

    # Do whatever you need to do with the KML data.
    ...
    merged_gdf = ...

    # Return the result.
    response_body = merged_gdf.to_json()
    return (response_body, 200, PERMISSIVE_CORS_HEADERS)
