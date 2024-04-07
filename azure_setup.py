from azure.identity import DefaultAzureCredential
from azure.mgmt.web import WebSiteManagementClient
from azure.mgmt.web.models import Site

def create_web_app(resource_group_name, app_name):
    credential = DefaultAzureCredential()
    web_client = WebSiteManagementClient(credential, "e5c493ed-34c5-4156-b1e6-5984030610ee")
    site_config = Site(server_farm_id="ASP-googlemeet-adfb")
    site = web_client.web_apps.create_or_update(resource_group_name, app_name, site_config)
    return site
