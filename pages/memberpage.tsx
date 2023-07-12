import Layout from "../components/ui_components/Layout"
import { getMemberHook } from "../hooks/MemberHooks";
import { MemberForm } from "../interfaces";

type Props = {
    row: Row<DocumentData>
}

const memberpage: React.FC<Props> = (props) => {
    const [profileData, setProfileData] = useState<MemberForm>({});
    const id = row.original.memberId;

    useEffect(() => {
        const fetchedProfile = getMemberHook({
            memberId: id
        });

        setProfileData(fetchedProfile)
    }, [])

    return (
        <Layout title={profileData.name}>
            <div>
                <Heading as="h2">{profileData.name}</Heading>
                
            </div>
        </Layout>
    )
}

export default memberpage