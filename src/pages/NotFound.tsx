import { Link } from 'react-router-dom'
import { PageHeading } from '../components/common'

export function NotFound() {
  return <div className="not-found"><PageHeading title="That page isn't here" description="The link may have changed. Head back to your learning workspace." /><Link className="button button-primary" to="/">Go to dashboard</Link></div>
}
