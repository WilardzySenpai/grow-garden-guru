import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface WeatherDataHook {
	weatherData: any;
	wsStatus: 'connecting' | 'connected' | 'disconnected';
}

export const useWeatherData = (userId: string | null): WeatherDataHook => {
	const [weatherData, setWeatherData] = useState<any>(null);
	const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
	const wsRef = useRef<WebSocket | null>(null);

	useEffect(() => {
		if (!userId) {
		setWsStatus('disconnected');
		setWeatherData(null);
		return;
		}

		const connectWebSocket = () => {
		try {
			setWsStatus('connecting');
			const ws = new WebSocket(`wss://websocket.joshlei.com/growagarden?user_id=${encodeURIComponent(userId)}`);
			wsRef.current = ws;

			ws.onopen = () => {
			console.log('Weather WebSocket connection established');
			setWsStatus('connected');
			toast({
				title: "Weather Connected",
				description: "Real-time weather updates enabled!",
			});
			};

			ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				
				// Only process weather data from WebSocket
				if (data.weather) {
				console.log('Weather data received:', data.weather);
				setWeatherData(data.weather);
				}
			} catch (error) {
				console.error('Error parsing weather WebSocket message:', error);
			}
			};

			ws.onerror = (error) => {
			console.error('Weather WebSocket error:', error);
			setWsStatus('disconnected');
			};

			ws.onclose = (event) => {
			console.log('Weather WebSocket connection closed', event.code, event.reason);
			setWsStatus('disconnected');
			
			// Only attempt to reconnect if not a normal closure
			if (event.code !== 1000) {
				setTimeout(() => {
				if (wsRef.current?.readyState === WebSocket.CLOSED) {
					console.log('Attempting to reconnect weather WebSocket...');
					connectWebSocket();
				}
				}, 5000);
			}
			};

		} catch (error) {
			console.error('Failed to create weather WebSocket connection:', error);
			setWsStatus('disconnected');
		}
		};

		connectWebSocket();

		return () => {
		if (wsRef.current) {
			console.log('Closing weather WebSocket connection');
			wsRef.current.close();
			wsRef.current = null;
		}
		};
	}, [userId]);

	return {
		weatherData,
		wsStatus,
	};
};