import React from 'react';
import Spinner from '@/components/elements/Spinner';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import StatGraphs from '@/components/server/console/StatGraphs';
import ServerDetailsBlock from '@/components/server/console/ServerDetailsBlock';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import CopyOnClick from '@/components/elements/CopyOnClick';
import { ServerContext } from '@/state/server';
import tw from 'twin.macro';

export default () => {
    const node = ServerContext.useStoreState((state) => state.server.data!.node);
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const internalId = ServerContext.useStoreState((state) => state.server.data!.internalId);
    const dockerImage = ServerContext.useStoreState((state) => state.server.data!.dockerImage);
    const invocation = ServerContext.useStoreState((state) => state.server.data!.invocation);
    const allocation = ServerContext.useStoreState((state) => {
        const match = state.server.data!.allocations.find((allocation) => allocation.isDefault);
        return !match ? 'n/a' : `${match.alias || match.ip}:${match.port}`;
    });

    return (
        <ServerContentBlock title={'Diagnostic'}>
            <div className={'grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 mb-4'}>
                <Spinner.Suspense>
                    <StatGraphs />
                </Spinner.Suspense>
            </div>
            <ServerDetailsBlock className={'mb-4'} />
            <TitledGreyBox title={'Debug Information'} css={tw`max-w-4xl`}>
                <div className={'grid gap-y-2 sm:grid-cols-2 text-sm'}>
                    <div className={'flex items-center justify-between'}>
                        <p>Node</p>
                        <code className={'font-mono bg-neutral-900 rounded py-1 px-2'}>{node}</code>
                    </div>
                    <CopyOnClick text={uuid}>
                        <div className={'flex items-center justify-between'}>
                            <p>Server ID</p>
                            <code className={'font-mono bg-neutral-900 rounded py-1 px-2'}>{uuid}</code>
                        </div>
                    </CopyOnClick>
                    <div className={'flex items-center justify-between'}>
                        <p>Internal ID</p>
                        <code className={'font-mono bg-neutral-900 rounded py-1 px-2'}>{internalId}</code>
                    </div>
                    <div className={'flex items-center justify-between'}>
                        <p>Default Allocation</p>
                        <code className={'font-mono bg-neutral-900 rounded py-1 px-2'}>{allocation}</code>
                    </div>
                    <div className={'flex items-center justify-between'}>
                        <p>Docker Image</p>
                        <code className={'font-mono bg-neutral-900 rounded py-1 px-2'}>{dockerImage}</code>
                    </div>
                    <CopyOnClick text={invocation}>
                        <div className={'flex items-center justify-between'}>
                            <p>Startup Command</p>
                            <code className={'font-mono bg-neutral-900 rounded py-1 px-2 overflow-x-auto'}>{invocation}</code>
                        </div>
                    </CopyOnClick>
                </div>
            </TitledGreyBox>
        </ServerContentBlock>
    );
};
