import Box from '@/components/Box';
import { Table } from '@arco-design/web-react';

export default function Dashboard() {
  return (
    <main
      className="dpfx"
      style={{ gap: 16, minHeight: 'calc(100vh - 100px)' }}
    >
      <div className="flex1 dpfx flexCol">
        <Box
          className="pad mb16"
          title="Shortcuts"
          icon="⚡️"
          style={{ flex: 2 }}
        >
          <Table
            columns={[
              { title: 'Name' },
              { title: 'Description' },
              { title: 'Time' },
            ]}
          />
        </Box>

        <Box className="pad flex1" title="Featured" icon="🎉">
          <Table
            columns={[
              { title: 'Name' },
              { title: 'Description' },
              { title: 'Time' },
            ]}
          />
        </Box>
      </div>

      <Box className="pad" title="Running" icon="🏃" style={{ flex: 2 }}>
        <Table
          columns={[
            { title: 'Name' },
            { title: 'Description' },
            { title: 'Time' },
          ]}
        />
      </Box>
    </main>
  );
}
