import Loading from '@/components/custom/Loading';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function UnderConstruction() {
	return (
		<div className='flex flex-col items-center gap-4'>
			<Loading pageView={true} text='Under Construction!' />
			<Button asChild>
				<Link href='/dashboard'>Return Home</Link>
			</Button>
		</div>
	);
}

export default UnderConstruction;
