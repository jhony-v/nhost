import useIsPlatform from '@/hooks/common/useIsPlatform';
import { useCurrentWorkspaceAndApplication } from '@/hooks/useCurrentWorkspaceAndApplication';
import { generateRemoteAppUrl } from '@/utils/helpers';
import type { MutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import type {
  DeleteColumnOptions,
  DeleteColumnVariables,
} from './deleteColumn';
import deleteColumn from './deleteColumn';
import deleteColumnMigration from './deleteColumnMigration';

export interface UseDeleteColumnMutationOptions
  extends Partial<DeleteColumnOptions> {
  /**
   * Props passed to the underlying mutation hook.
   */
  mutationOptions?: MutationOptions<void, unknown, DeleteColumnVariables>;
}

/**
 * This hook is a wrapper around a fetch call that deletes one or more columns
 * from the table.
 *
 * @param options - Options to use for the mutation.
 * @returns The result of the mutation.
 */
export default function useDeleteColumnMutation({
  dataSource: customDataSource,
  schema: customSchema,
  table: customTable,
  appUrl: customAppUrl,
  adminSecret: customAdminSecret,
  mutationOptions,
}: UseDeleteColumnMutationOptions = {}) {
  const isPlatform = useIsPlatform();
  const {
    query: { dataSourceSlug, schemaSlug, tableSlug },
  } = useRouter();
  const { currentApplication } = useCurrentWorkspaceAndApplication();
  const appUrl = generateRemoteAppUrl(currentApplication?.subdomain);
  const mutationFn = isPlatform ? deleteColumn : deleteColumnMigration;

  const mutation = useMutation(
    (variables) =>
      mutationFn({
        ...variables,
        appUrl: customAppUrl || appUrl,
        adminSecret:
          customAdminSecret || currentApplication?.hasuraGraphqlAdminSecret,
        dataSource: customDataSource || (dataSourceSlug as string),
        schema: customSchema || (schemaSlug as string),
        table: customTable || (tableSlug as string),
      }),
    mutationOptions,
  );

  return mutation;
}