import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import ContentFour from '@/components/content-four'
import TeamSectionTwo from '@/components/team-section-two'

function About() {
    return (
        <div className="relative">
            <Button asChild size="default" className="absolute top-4 left-4 z-10 bg-[#2563eb] hover:bg-[#2563eb]/90 text-white">
                <Link to="/">← Back to landing page</Link>
            </Button>
            <ContentFour />
            <TeamSectionTwo />
        </div>
    )
}

export default About
