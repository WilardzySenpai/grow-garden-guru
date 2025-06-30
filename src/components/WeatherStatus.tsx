
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Weather {
  weather_id: string;
  weather_name: string;
  icon: string;
  active: boolean;
  end_duration_unix: number;
  duration: number;
  start_duration_unix: number;
}

interface WeatherResponse {
  weather: Weather[];
}

export const WeatherStatus = () => {
  const [weatherData, setWeatherData] = useState<Weather[]>([]);
  const [currentWeather, setCurrentWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeatherData();
    
    // Refresh weather data every 60 seconds
    const interval = setInterval(fetchWeatherData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchWeatherData = async () => {
    try {
      setError(null);
      console.log('WeatherStatus: Fetching weather data from API');
      
      const response = await fetch('https://api.joshlei.com/v2/growagarden/weather');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: WeatherResponse = await response.json();
      console.log('WeatherStatus: Weather data received', data);
      
      const weatherArray = data.weather || [];
      setWeatherData(weatherArray);
      
      // Find active weather or use the first one
      const activeWeather = weatherArray.find(w => w.active);
      setCurrentWeather(activeWeather || weatherArray[0] || null);
      
    } catch (error) {
      console.error('WeatherStatus: Failed to fetch weather data:', error);
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatTimeRemaining = (endUnix: number) => {
    if (endUnix === 0) return 'No end time';
    
    const now = Math.floor(Date.now() / 1000);
    const remaining = endUnix - now;
    
    if (remaining <= 0) return 'Ending soon';
    
    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    
    return hours > 0 ? `${hours}h ${minutes}m left` : `${minutes}m left`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="market-card">
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Loading weather data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Card className="border-red-500/50 bg-red-500/10">
          <CardContent className="py-4">
            <p className="text-center text-red-600 text-sm">
              ❌ {error}
            </p>
          </CardContent>
        </Card>
      )}

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
                <div className="text-6xl">
                  {typeof currentWeather.icon === 'string' && currentWeather.icon.startsWith('http') ? (
                    <img 
                      src={currentWeather.icon}
                      alt={currentWeather.weather_name}
                      className="w-16 h-16 object-contain mx-auto"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span>🌤️</span>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold">{currentWeather.weather_name}</h3>
                <Badge variant={currentWeather.active ? "default" : "secondary"} className="mt-2">
                  {currentWeather.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              {currentWeather.end_duration_unix > 0 && (
                <div className="text-sm text-muted-foreground">
                  {formatTimeRemaining(currentWeather.end_duration_unix)}
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                Base Duration: {formatDuration(currentWeather.duration)}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-6xl">☀️</div>
              <div>
                <h3 className="text-xl font-semibold">Clear Skies</h3>
                <Badge variant="secondary" className="mt-2">
                  No Weather Data
                </Badge>
              </div>
            </div>
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
            {weatherData.filter(w => !w.active).slice(0, 6).map((weather) => (
              <div key={weather.weather_id} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg border">
                <div className="flex items-center gap-3">
                  {typeof weather.icon === 'string' && weather.icon.startsWith('http') ? (
                    <img 
                      src={weather.icon}
                      alt={weather.weather_name}
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-xl">🌤️</span>
                  )}
                  <span className="font-medium">{weather.weather_name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDuration(weather.duration)}
                </div>
              </div>
            ))}
            {weatherData.filter(w => !w.active).length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                {weatherData.length === 0 ? 'No weather data available' : 'No inactive weather to show'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
