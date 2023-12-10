import Box from '@/components/Box';

export default function About() {
  return (
    <main className="">
      <Box
        className="pad dpfx"
        style={{ height: 'calc(100vh - 100px)', flexDirection: 'column' }}
      >
        <div
          className="mb16 fs16 textCenter fw500"
          style={{ fontStyle: 'italic', marginTop: '15%' }}
        >
          Instead of typing a command, click it.
        </div>

        <footer className="mono textCenter" style={{ marginTop: 'auto' }}>
          ClickCommand ©2023
        </footer>
      </Box>
    </main>
  );
}
