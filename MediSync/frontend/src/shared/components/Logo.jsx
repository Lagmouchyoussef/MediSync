export default function Logo({ size = 40, light = false }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}logo-medisync.png`}
      alt="MediSync Logo"
      style={{
        width: size,
        height: 'auto',
        maxHeight: size,
        display: 'block'
      }}
    />
  );
}