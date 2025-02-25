'use client';
export function Btn() {
  return (
    <button
      onClick={async () => {
        const res = await fetch('/api/minio', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({ messages: 'asdf' }),
        }).then((res) => res.json());

        console.log('🚀 ~ onClick={ ~ res:', res);
      }}
    >
      btn
    </button>
  );
}
