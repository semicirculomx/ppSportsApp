import DOMPurify from 'dompurify';
/**
 * truncates text after n newlines
 * @param {String} text to trunaate 
 * @param {Number} lines number of lines to have
 * 
 * 
 */

export const dateConverter = (date) => {
    let dateText = new Date(date)

    return `${dateText.toLocaleDateString(['es-MX'], { month: '2-digit', day: 'numeric',  })} | ${dateText.toLocaleTimeString(['es-MX'], { hour: '2-digit', minute: '2-digit' })}`
}

export const findLongestMarketsArray = arr => {
    try {
        return arr.reduce((acc, curr) => {
            if (curr.markets && curr.markets.length > acc.markets.length) {
                return curr
            } else {
                return acc
            }
        })
    } catch (error) {
        return []
    }
}

export const calculateImpliedProbability = (americanOdd) => {
    let impliedProbability;
  
    if (americanOdd > 0) {
      // Positive odds
      impliedProbability = (100 / (americanOdd + 100)) * 100;
    } else {
      // Negative odds
      impliedProbability = (Math.abs(americanOdd) / (Math.abs(americanOdd) + 100)) * 100;
    }
  
    // Return the implied probability as a string with a '%' sign
    return impliedProbability.toFixed(2) + '%';
  }
  

export const  gameDate = ({matchup}) => {
    let date = new Date(matchup).toLocaleString('en-US').split("");
    date.splice(date.length - 6, 4);
    let formattedDate = date.join("").split(",").join("");
    let dateToCompare = formattedDate.split(" ");
    let currentDate = `${new Date().getMonth() + 1}/${new Date().getDate()}/${new Date().getFullYear()}`;
    if (dateToCompare[0] === currentDate)
        formattedDate = `Hoy ${dateToCompare[1]}`;

    return (
        <span className="date">{formattedDate}</span>
    )

}
export const truncatedText = ( text, maxLength ) => {
    if (text.length <= maxLength) {
      return <span>{text}</span>;
    }
    return <span>{text.substring(0, maxLength)}...</span>;
  }

export const truncateText = (text, lines) => {
    if (!text)
        return ''
    let n = 0, i = 0
    let length = text.length
    for (i = 0; i < length; i++)
        if (text[i] === '\n')
            if (n++ >= lines - 1)
                break
    return text.slice(0, i) + ((length > i + 1) ? ' ...' : '')
}

export function numFormatter(num) {
    if (num >= 1000 && num < 1000000) {
        return (num / 1000).toFixed(2) + 'K'; // convert to K for number from > 1000 < 1 million 
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
    } else if (num < 1000) {
        return num; // if value < 1000, nothing to do
    }
}

/**
 * @returns input if good
 * @throws {Error} with msg 'message for front-end'}
 * @param {String} input - input to sanitize
 * @param type - one of 'name', 'username', 'password', 'html', 'custom'
 * @param {Object} opts optional setings with sig { min_length, max_length, regex }
 */
export function filterInput(input = '', type = 'custom', {
    min_length: min = 1,
    max_length: max = 60000,
    regex: reg = null,
    identifier = null
} = {}) {
    identifier = identifier || `input {${type}}`
    input = input.toString().trim()
    let regexes = {
        username: RegExp(`^[_a-zA-Z0-9]{${min},${max}}$`),
        password: RegExp(`^\\S{${min},${max}}$`),
        name: RegExp(`^.{${min},${max}}$`),
    }
    if (!reg) {
        reg = regexes[type]
    }
    if (reg) {
        if (!reg.test(input)) {
            throw Error(`${identifier} Debe coincidir el regex: ${reg} (rangos entre ${min} y ${max} caratéres)`)
        }
    }
    //else custom || html
    if (type === 'html_strict'){
        input = DOMPurify.sanitize(input, { ALLOWED_TAGS: ['b', 'h2', 'h3', 'h1','i','p','img','br','div' ], ALLOWED_ATTR: ['style','href','target'] }).trim()
    } else if (type === 'text') {
        input = DOMPurify.sanitize(input, { ALLOWED_TAGS: ['b'] });
    } else {
        input = DOMPurify.sanitize(input, { ALLOWED_TAGS: ['b', 'h2', 'h3', 'h1','i','p','img','br','div' ], ALLOWED_ATTR: ['style','href','src','target'] }).trim()
    }
    if (input.length > max || input.length < min) {
        throw Error(`${identifier} must be minimum ${min} and maximum ${max} characters`)
    }
    if (input.includes('\n')) // long text, strip of multiple newlines etc
        input = input.replace(/\n+/g, '\n').trim()
    return input;
}