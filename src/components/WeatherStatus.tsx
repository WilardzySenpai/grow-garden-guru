
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

export const WeatherStatus = () => {
  const [weatherData, setWeatherData] = useState<Weather[]>([]);
  const [currentWeather, setCurrentWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeatherData();
    
    // Refresh weather data every 60 seconds (increased from 30 to reduce API calls)
    const interval = setInterval(fetchWeatherData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchWeatherData = async () => {
    try {
      setError(null);
      // Temporarily disable API calls due to CORS issues
      console.log('Weather API temporarily disabled due to CORS policy');
      
      // Mock data for demonstration
      const mockWeather: Weather[] = [
        {
          weather_id: '1',
          weather_name: 'Clear Skies',
          icon: '☀️',
          active: true,
          end_duration_unix: 0,
          duration: 0,
          start_duration_unix: Math.floor(Date.now() / 1000)
        }
      ];
      
      setWeatherData(mockWeather);
      setCurrentWeather(mockWeather[0]);
      setError('API temporarily unavailable due to CORS policy');
      
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
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
        <Card className="border-yellow-500/50 bg-yellow-500/10">
          <CardContent className="py-4">
            <p className="text-center text-yellow-600 text-sm">
              ⚠️ {error}
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
                      className="w-16 h-16 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    currentWeather.icon
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold">{currentWeather.weather_name}</h3>
                <Badge variant="default" className="mt-2">
                  Active
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
                  No Active Weather
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
                    <span className="text-xl">{weather.icon}</span>
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
                No forecast data available
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
