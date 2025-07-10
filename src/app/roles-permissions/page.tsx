'use client';

import PageHeader from '@/components/custom/PageHeader';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import SidebarLayout from '@/layouts/Sidebar/Layout';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

import { useRolePermissions } from './useRolePermissions';
import Loading from '@/components/custom/Loading';

function RolesPermissions() {
	const { rolePermissions, loading, error } = useRolePermissions();

	if (loading)
		return (
			<SidebarLayout>
				<Loading text='Loading Roles & Permissions' pageView={true} />
			</SidebarLayout>
		);
	if (error) return <p className='text-red-500'>Error: {error}</p>;

	console.log(rolePermissions);

	// Extract role names dynamically
	const availableRoles = rolePermissions.map((role) => role.roleTag);

	// Extract all unique permissions across roles
	const allPermissions = rolePermissions
		.flatMap((role) => role.permissions)
		.reduce(
			(acc, permission) => {
				if (
					!acc.some(
						(p) => p.permissionTag === permission.permissionTag
					)
				) {
					acc.push(permission);
				}
				return acc;
			},
			[] as { permissionTag: string; description: string }[]
		);

	return (
		<SidebarLayout>
			<PageHeader
				title='Roles & Permissions'
				extra={<Button>Edit Permissions</Button>}
			/>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className='w-[150px]'>Permission</TableHead>
						<TableHead>Description</TableHead>
						{availableRoles.map((role) => (
							<TableHead key={role}>{role}</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{allPermissions.map((permission) => (
						<TableRow key={permission.permissionTag}>
							<TableCell className='font-medium'>
								{permission.permissionTag}
							</TableCell>
							<TableCell>{permission.description}</TableCell>
							{availableRoles.map((role) => (
								<TableCell
									key={`${permission.permissionTag}-${role}`}
								>
									<div className='flex justify-start items-center'>
										<Checkbox
											checked={
												rolePermissions
													.find(
														(r) =>
															r.roleTag === role
													)
													?.permissions.some(
														(p) =>
															p.permissionTag ===
															permission.permissionTag
													) ?? false
											}
											disabled={true}
										/>
									</div>
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</SidebarLayout>
	);
}

export default RolesPermissions;
