const User = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <>User Profile : {id}</>;
};

export default User;
