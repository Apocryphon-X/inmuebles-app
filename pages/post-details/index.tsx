import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  // Redirecciona al usuario a la raíz si intentan acceder a esta página directamente.
  return {
    redirect: {
      destination: '/',
      permanent: false, // `false` indica que es una redirección temporal (HTTP 307).
    },
  };
};

// Exporta un componente vacío porque esta página no debería renderizarse nunca.
const PostDetailsIndex = () => {
  return null;
};

export default PostDetailsIndex;

