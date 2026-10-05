import os
from databricks import sql
from databricks.sdk.core import Config
import pandas as pyarrow
import streamlit as st 

st.set_page_config(
    page_title="Databricks Northflank Dashboard", layout="wide"
)
st.title(" Databricks Analytics Dashboard")

config = Config(
    host=os.getenv("DATABRICKS_SERVER_HOSTNAME"),
    client_id=os.getenv("DATABRICKS_CLIENT_ID"),
    client_secret=os.getenv("DATABRICKS_CLIENT_SECRET"),
)

# Initialize Databricks connection
@st.cache_resource
def init_connection():
    return sql.connect(
        server_hostname=os.getenv("DATABRICKS_SERVER_HOSTNAME"),
        http_path=os.getenv("DATABRICKS_HTTP_PATH"),
        #access_token=os.getenv("DATABRICKS_TOKEN"),
        credentials_provider=config.authenticate()
    )

try:
    conn=init_connection()
    st.success("Connected to Databricks successfully!")
except Exception as e:
    st.error(f"Connection failed: {e}")
    st.stop()

# Load data function
@st.cache_data(ttl=600)
def load_data(query):
    with conn.cursor() as cursor:
        cursor.execute(query)
        # fetchall_arrow().to_pandas() is effecient for large datasets
        return cursor.fetchall_arrow().to_pandas()

# Input custom query or pick a table
query = st.text_area(
    "Enter SQL Query:", "SELECT * FROM samples.nyctaxi.trips LIMIT 100"
)

if st.button("Run Query"):
    with st.spinner("Fetching data from Databricks..."):
        try:
            df = load_data(query)
            st.dataframe(df, use_container_width=True)

            # Optional: Simple metric or chart example
            st.metric(
                label="Total Rows Fetched", value=f"{df.shape[0]:,}"
            )
        except Exception as e:
            st.error(f"Error executing query: {e}")