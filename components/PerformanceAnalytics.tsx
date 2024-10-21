'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PerformanceAnalytics() {
  // Mock data for demonstration
  const analyticsData = {
    totalViews: 1000000,
    subscribers: 50000,
    topVideos: [
      { title: "Easy 5-Minute Breakfast", views: 150000 },
      { title: "Vegan Dinner Ideas", views: 120000 },
      { title: "Quick Dessert Recipes", views: 100000 },
    ],
    engagement: {
      likes: 25000,
      comments: 5000,
      shares: 10000,
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Channel Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-lg font-semibold">Total Views</p>
              <p className="text-3xl font-bold">{analyticsData.totalViews.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-lg font-semibold">Subscribers</p>
              <p className="text-3xl font-bold">{analyticsData.subscribers.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analyticsData.topVideos.map((video, index) => (
              <li key={index} className="flex justify-between">
                <span>{video.title}</span>
                <span>{video.views.toLocaleString()} views</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Engagement Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-lg font-semibold">Likes</p>
              <p className="text-2xl font-bold">{analyticsData.engagement.likes.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-lg font-semibold">Comments</p>
              <p className="text-2xl font-bold">{analyticsData.engagement.comments.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-lg font-semibold">Shares</p>
              <p className="text-2xl font-bold">{analyticsData.engagement.shares.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}