import asyncio
import platform
import nest_asyncio

# Fix for Windows Python 3.11+
if platform.system() == "Windows":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

# Allow nested event loops (required for Streamlit + asyncio)
nest_asyncio.apply()

import streamlit as st
from scraper import scrape_instagram_data
from stats import calculate_engagement

async def run_scraper(username):
    return await scrape_instagram_data(username)

st.set_page_config(page_title="Instagram Engagement Checker")
st.title("📊 Instagram Engagement Rate Checker")

username = st.text_input("Enter Instagram username (public profile only):", placeholder="e.g. natgeo")

if st.button("Check Engagement Rate"):
    if not username:
        st.warning("Please enter a valid username.")
    else:
        with st.spinner("Fetching data..."):
            try:
                # Proper async call within Streamlit
                loop = asyncio.get_event_loop()
                followers, likes_list, comments_list = loop.run_until_complete(run_scraper(username))
                
                engagement_rate = calculate_engagement(followers, likes_list, comments_list)
                avg_likes = int(sum(likes_list) / len(likes_list))
                avg_comments = int(sum(comments_list) / len(comments_list))

                st.success(f"@{username}")
                st.markdown(f"*Followers:* {followers:,}")
                st.markdown(f"*Avg Likes:* {avg_likes}")
                st.markdown(f"*Avg Comments:* {avg_comments}")
                st.markdown(f"*Engagement Rate:* {engagement_rate}%")
            except Exception as e:
                st.error(f"Error fetching data: {e}")
