import osmnx as ox
import networkx as nx
import geopandas as gpd
from shapely.geometry import Point, Polygon
import folium

# Step 1: Define the coordinates for your points
coordinates = [
    (-33.4489, -70.6693),  # Example point 1
    (-33.4569, -70.6483),  # Example point 2
    (-33.4456, -70.6847),  # Example point 3
    # Add your 97 points here
]

# Step 2: Fetch the street network for Santiago
print("Fetching street network...")
santiago_center = (-33.4489, -70.6693)  # Center point for the street network
G = ox.graph_from_point(santiago_center, dist=5000, network_type="drive")  # 5 km radius

# Step 3: Create a GeoDataFrame for the points
points = gpd.GeoDataFrame(
    {'id': range(1, len(coordinates) + 1)},  # Add IDs from 1 to 97
    geometry=[Point(lon, lat) for lat, lon in coordinates],
    crs="EPSG:4326"
)

# Project points and graph to the same CRS
points = points.to_crs(crs=ox.projection.project_graph(G).graph['crs'])
G_proj = ox.projection.project_graph(G)

# Step 4: Calculate the nearest network node for each point
points['nearest_node'] = points.geometry.apply(
    lambda x: ox.distance.nearest_nodes(G_proj, x.x, x.y)
)

# Step 5: Calculate shortest path distance and assign areas
print("Calculating areas...")
voronoi_regions = {}
for node in points['nearest_node']:
    subgraph = nx.single_source_dijkstra_path_length(G_proj, node, cutoff=5000)
    voronoi_regions[node] = subgraph

# Step 6: Generate Voronoi polygons
def create_voronoi(regions, graph):
    polygons = []
    for node, distances in regions.items():
        region_nodes = [n for n in distances.keys()]
        region_points = [Point(G_proj.nodes[n]['x'], G_proj.nodes[n]['y']) for n in region_nodes]
        polygon = gpd.GeoSeries(region_points).unary_union.convex_hull
        polygons.append(Polygon(polygon))
    return gpd.GeoDataFrame(geometry=polygons, crs=G_proj.graph['crs'])

voronoi_gdf = create_voronoi(voronoi_regions, G_proj)

# Reproject to WGS84 for mapping
voronoi_gdf = voronoi_gdf.to_crs(epsg=4326)

# Step 7: Create a Folium map
print("Creating the map...")
m = folium.Map(location=santiago_center, zoom_start=13)

# Add polygons to the map
for _, row in voronoi_gdf.iterrows():
    folium.Polygon(
        locations=[(point.y, point.x) for point in row.geometry.exterior.coords],
        color="blue",
        fill=True,
        fill_opacity=0.4
    ).add_to(m)

# Add points to the map with numbers
for idx, (lat, lon) in enumerate(coordinates, start=1):
    folium.Marker(
        location=[lat, lon],
        icon=folium.DivIcon(html=f'<div style="font-size: 12px; color: red;"><b>{idx}</b></div>'),
    ).add_to(m)

# Save the map to an HTML file
m.save("santiago_voronoi_map.html")
print("Map created and saved as 'santiago_voronoi_map.html'.")
