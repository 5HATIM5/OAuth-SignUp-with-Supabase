import { Button, ButtonProps } from '@mantine/core';

function FacebookIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 512"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      <path
        fill="#1877F2"
        d="M279.14 288l14.22-92.66h-88.91V127.5c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26
        S293.3 0 262.16 0c-73.36 0-121.09 44.38-121.09 124.72v70.62H89.09V288h52v224h100.2V288z"
      />
    </svg>
  );
}

export function FacebookButton(props: ButtonProps & React.ComponentPropsWithoutRef<'button'>) {
  return <Button leftSection={<FacebookIcon />} variant="default" {...props} />;
}
