import moment from 'moment'

export default function FormattedDate({ date }) {
  const normalDate = date / 1000000
  const formattedDate = moment(normalDate).format('MMMM Do YYYY')
  return formattedDate
}
