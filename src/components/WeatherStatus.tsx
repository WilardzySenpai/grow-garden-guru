import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Database } from '@/types/database.types';

type Weather = Database['public']['Tables']['weather']['Row'];

interface WeatherStatusProps {
    weatherData: Weather[];
    loading: boolean;
    error: string | null;
}

export const WeatherStatus = ({ weatherData, loading, error }: WeatherStatusProps) => {
    const activeWeathers = weatherData.filter(w => w.active);
    const forecastWeathers = weatherData.filter(w => !w.active).slice(0, 6);

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
                        🌦️ {activeWeathers.length > 1 ? 'Active Weather Events' : 'Current Weather'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {activeWeathers.length > 0 ? (
                        <div className="space-y-6">
                            {activeWeathers.map((weather) => (
                                <div key={weather.weather_id} className="text-center space-y-4">
                                    <div className="flex justify-center">
                                        <div className="text-6xl">
                                            {typeof weather.icon === 'string' && weather.icon.startsWith('http') ? (
                                                <img
                                                    src={weather.icon}
                                                    alt={weather.weather_name}
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
                                        <h3 className="text-xl font-semibold">{weather.weather_name}</h3>
                                        <Badge variant="default" className="mt-2">Active</Badge>
                                    </div>
                                    {weather.end_duration_unix > 0 && (
                                        <div className="text-sm text-muted-foreground">
                                            {formatTimeRemaining(weather.end_duration_unix)}
                                        </div>
                                    )}
                                    <div className="text-sm text-muted-foreground">
                                        Base Duration: {formatDuration(weather.duration)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="text-6xl">☀️</div>
                            <div>
                                <h3 className="text-xl font-semibold">Clear Skies</h3>
                                <Badge variant="secondary" className="mt-2">No active weather</Badge>
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
                        {forecastWeathers.map((weather) => (
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
                        {forecastWeathers.length === 0 && (
                            <p className="text-center text-muted-foreground py-4">
                                No upcoming weather.
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
