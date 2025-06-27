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

    return (
        <ServerContentBlock title={'Diagnostic'}>
            <div className={'grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 mb-4'}>
                <Spinner.Suspense>
                    <StatGraphs />
                </Spinner.Suspense>
            </div>
            <ServerDetailsBlock className={'mb-4'} />
            <TitledGreyBox title={'Debug Information'} css={tw`max-w-lg`}>
                <div className={'flex items-center justify-between text-sm'}>
                    <p>Node</p>
                    <code className={'font-mono bg-neutral-900 rounded py-1 px-2'}>{node}</code>
                </div>
                <CopyOnClick text={uuid}>
                    <div className={'flex items-center justify-between mt-2 text-sm'}>
                        <p>Server ID</p>
                        <code className={'font-mono bg-neutral-900 rounded py-1 px-2'}>{uuid}</code>
                    </div>
                </CopyOnClick>
            </TitledGreyBox>
        </ServerContentBlock>
    );
};
