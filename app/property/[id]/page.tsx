import PropertyDetail from "@/components/property-detail"

interface PropertyPageProps {
  params: Promise<{ id: string }>
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params
  return <PropertyDetail propertyId={id} />
}
