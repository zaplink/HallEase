'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Database,
	RefreshCw,
	AlertCircle,
	CheckCircle,
	Code,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import {
	testDatabaseConnection,
	testAnalyticsQueries,
} from '@/lib/database-test';

interface DatabaseStatusProps {
	onDataSourceChange?: (useRealData: boolean) => void;
}

export function DatabaseStatus({ onDataSourceChange }: DatabaseStatusProps) {
	const [isConnected, setIsConnected] = React.useState<boolean | null>(null);
	const [isChecking, setIsChecking] = React.useState(false);
	const [useRealData, setUseRealData] = React.useState(true);
	const [tableStats, setTableStats] = React.useState<any>(null);
	const [showDebug, setShowDebug] = React.useState(false);
	const [debugInfo, setDebugInfo] = React.useState<string[]>([]);

	const checkDatabaseConnection = async () => {
		setIsChecking(true);
		try {
			// Test database connection by checking tables
			const [reserveResult, hallResult, profileResult] =
				await Promise.all([
					supabase
						.from('reserve')
						.select('count', { count: 'exact', head: true }),
					supabase
						.from('hall')
						.select('count', { count: 'exact', head: true }),
					supabase
						.from('profiles')
						.select('count', { count: 'exact', head: true }),
				]);

			if (
				reserveResult.error ||
				hallResult.error ||
				profileResult.error
			) {
				throw new Error('Database connection failed');
			}

			setIsConnected(true);
			setTableStats({
				reserves: reserveResult.count || 0,
				halls: hallResult.count || 0,
				users: profileResult.count || 0,
			});
		} catch (error) {
			console.error('Database connection error:', error);
			setIsConnected(false);
			setTableStats(null);
		} finally {
			setIsChecking(false);
		}
	};

	React.useEffect(() => {
		checkDatabaseConnection();
	}, []);

	const runDatabaseTest = async () => {
		setShowDebug(true);
		setDebugInfo(['Starting database connection test...']);

		const connectionSuccess = await testDatabaseConnection();
		const queriesSuccess = await testAnalyticsQueries();

		setDebugInfo((prev) => [
			...prev,
			connectionSuccess
				? '✅ Database connection successful'
				: '❌ Database connection failed',
			queriesSuccess
				? '✅ Analytics queries successful'
				: '❌ Analytics queries failed',
		]);
	};

	const toggleDataSource = () => {
		const newUseRealData = !useRealData;
		setUseRealData(newUseRealData);
		onDataSourceChange?.(newUseRealData && isConnected === true);
	};

	return (
		<Card className='mb-6'>
			<CardHeader>
				<CardTitle className='flex items-center gap-2'>
					<Database className='h-5 w-5' />
					Database Status
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-4'>
						<div className='flex items-center gap-2'>
							{isConnected === null ? (
								<div className='w-2 h-2 bg-gray-500 rounded-full animate-pulse'></div>
							) : isConnected ? (
								<CheckCircle className='h-5 w-5 text-green-500' />
							) : (
								<AlertCircle className='h-5 w-5 text-red-500' />
							)}
							<span className='text-sm font-medium'>
								{isConnected === null
									? 'Checking...'
									: isConnected
										? 'Connected'
										: 'Disconnected'}
							</span>
						</div>

						{tableStats && (
							<div className='flex items-center gap-4 text-sm text-muted-foreground'>
								<span>Reserves: {tableStats.reserves}</span>
								<span>Halls: {tableStats.halls}</span>
								<span>Users: {tableStats.users}</span>
							</div>
						)}
					</div>

					<div className='flex items-center gap-2'>
						<Badge
							variant={
								useRealData && isConnected
									? 'default'
									: 'secondary'
							}
						>
							{useRealData && isConnected
								? 'Real Data'
								: 'Mock Data'}
						</Badge>

						<Button
							variant='outline'
							size='sm'
							onClick={toggleDataSource}
							disabled={!isConnected}
						>
							{useRealData ? 'Use Mock Data' : 'Use Real Data'}
						</Button>

						<Button
							variant='outline'
							size='sm'
							onClick={checkDatabaseConnection}
							disabled={isChecking}
						>
							{isChecking ? (
								<RefreshCw className='h-4 w-4 animate-spin' />
							) : (
								<RefreshCw className='h-4 w-4' />
							)}
						</Button>

						<Button
							variant='outline'
							size='sm'
							onClick={runDatabaseTest}
						>
							<Code className='h-4 w-4 mr-1' />
							Test DB
						</Button>
					</div>
				</div>

				{!isConnected && (
					<div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
						<p className='text-sm text-red-700'>
							<strong>Database Connection Failed:</strong>{' '}
							Analytics will show mock data. Check your database
							connection and table permissions.
						</p>
					</div>
				)}

				{showDebug && (
					<div className='mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg'>
						<h4 className='text-sm font-medium mb-2'>
							Database Debug Info:
						</h4>
						<div className='text-xs text-gray-600 font-mono space-y-1'>
							{debugInfo.map((info, index) => (
								<div key={index}>{info}</div>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
