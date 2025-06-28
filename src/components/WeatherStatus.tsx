
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cloud_drizzle, cloud_rain, cloud_sun, cloudy, sun } from 'lucide-react';

interface Weather {
  weather_name: string;
  icon: string;
  active: boolean;
  end_duration_unix?: number;
  duration: number;
}

export const WeatherStatus = () => {
  const [currentWeather, setCurrentWeather] = useState<Weather | null>(null);
  const [weatherForecast, setWeatherForecast] = useState<Weather[]>([]);

  useEffect(() => {
    // Simulate weather data - in production, fetch from /weather endpoint
    const mockCurrentWeather: Weather = {
      weather_name: 'Sunny',
      icon: 'sun',
      active: true,
      end_duration_unix: Math.floor((Date.now() + 2 * 60 * 60 * 1000) / 1000),
      duration: 4 * 60 * 60 // 4 hours in seconds
    };

    const mockForecast: Weather[] = [
      {
        weather_name: 'Light Rain',
        icon: 'cloud-drizzle',
        active: false,
        duration: 2 * 60 * 60
      },
      {
        weather_name: 'Heavy Rain',
        icon: 'cloud-rain',
        active: false,
        duration: 1 * 60 * 60
      },
      {
        weather_name: 'Partly Cloudy',
        icon: 'cloud-sun',
        active: false,
        duration: 3 * 60 * 60
      },
      {
        weather_name: 'Overcast',
        icon: 'cloudy',
        active: false,
        duration: 6 * 60 * 60
      }
    ];

    setCurrentWeather(mockCurrentWeather);
    setWeatherForecast(mockForecast);
  }, []);

  const getWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case 'sun': return sun;
      case 'cloud-drizzle': return cloud_drizzle;
      case 'cloud-rain': return cloud_rain;
      case 'cloud-sun': return cloud_sun;
      case 'cloudy': return cloudy;
      default: return sun;
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatTimeRemaining = (endUnix: number) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = endUnix - now;
    
    if (remaining <= 0) return 'Ending soon';
    
    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    
    return hours > 0 ? `${hours}h ${minutes}m left` : `${minutes}m left`;
  };

  return (
    <div className="space-y-4">
      {/* Current Weather */}
      <Card className="market-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🌦️ Current Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentWeather ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                {(() => {
                  const IconComponent = getWeatherIcon(currentWeather.icon);
                  return <IconComponent className="h-16 w-16 text-primary" />;
                })()}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{currentWeather.weather_name}</h3>
                <Badge variant={currentWeather.active ? 'default' : 'secondary'} className="mt-2">
                  {currentWeather.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              {currentWeather.active && currentWeather.end_duration_unix && (
                <div className="text-sm text-muted-foreground">
                  {formatTimeRemaining(currentWeather.end_duration_unix)}
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                Base Duration: {formatDuration(currentWeather.duration)}
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Loading weather data...</p>
          )}
        </CardContent>
      </Card>

      {/* Weather Forecast */}
      <Card className="market-card">
        <CardHeader>
          <CardTitle>Weather Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weatherForecast.map((weather, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg border">
                <div className="flex items-center gap-3">
                  {(() => {
                    const IconComponent = getWeatherIcon(weather.icon);
                    return <IconComponent className="h-6 w-6 text-primary" />;
                  })()}
                  <span className="font-medium">{weather.weather_name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDuration(weather.duration)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
