from flask import Flask, request, jsonify
from flask_cors import CORS
import asyncio
import platform
import nest_asyncio

# Fix for Windows Python 3.11+
if platform.system() == "Windows":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

# Allow nested event loops
nest_asyncio.apply()

from scraper import scrape_instagram_data
from stats import calculate_engagement

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/check-engagement', methods=['POST'])
async def check_engagement():
    try:
        data = request.get_json()
        username = data.get('username', '').strip()
        
        if not username:
            return jsonify({'error': 'Username is required'}), 400
        
        # Run the scraper
        loop = asyncio.get_event_loop()
        followers, likes_list, comments_list = await scrape_instagram_data(username)
        
        if followers == 0 or not likes_list:
            return jsonify({'error': 'Could not fetch data for this profile. Make sure it\'s public.'}), 404
        
        # Calculate engagement
        engagement_rate = calculate_engagement(followers, likes_list, comments_list)
        avg_likes = int(sum(likes_list) / len(likes_list))
        avg_comments = int(sum(comments_list) / len(comments_list))
        
        return jsonify({
            'followers': followers,
            'avg_likes': avg_likes,
            'avg_comments': avg_comments,
            'engagement_rate': engagement_rate
        })
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Failed to fetch engagement data'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)