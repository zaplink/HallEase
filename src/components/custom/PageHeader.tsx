import { ReactNode, FC } from 'react';
import { Separator } from '@/components/ui/separator';

interface PageHeaderProps {
	title: string;
	descriptions?: string[];
	extra?: ReactNode;
}

const PageHeader: FC<PageHeaderProps> = ({
	title,
	descriptions = [],
	extra,
}) => {
	return (
		<div className='w-full pb-2 mb-2'>
			<div className='flex justify-between items-start pb-2'>
				<div>
					<h2 className='text-xl font-semibold'>{title}</h2>

					{descriptions.length > 0 && (
						<div className='text-gray-600 text-sm flex space-x-2'>
							{descriptions.map((desc, index) => (
								<span key={index} className='flex items-center'>
									{index > 0 && (
										<span className='mx-4 text-gray-400'>
											<Separator
												orientation='vertical'
												className='h-4'
											/>
										</span>
									)}
									{desc}
								</span>
							))}
						</div>
					)}
				</div>

				{extra && <div>{extra}</div>}
			</div>

			<Separator orientation='horizontal' className='mt-1' />
		</div>
	);
};

export default PageHeader;
