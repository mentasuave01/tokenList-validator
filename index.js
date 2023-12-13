import { schema } from '@uniswap/token-lists'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'

const spookyLists = {
    BTTC_LIST: 'https://assets.spooky.fi/btt_spooky_tokens.json',
    FANTOM_LIST: 'https://assets.spooky.fi/ftm_spooky_tokens.json',
    EON_LIST: 'https://assets.spooky.fi/eon_spooky_tokens.json',
}

async function validate(list) {
    const ajv = new Ajv({ allErrors: true, verbose: true })
    addFormats(ajv)
    const validator = ajv.compile(schema);
    const response = await fetch(list)
    const data = await response.json()
    const valid = validator(data)
    if (valid) {
        return valid
    }
    if (validator.errors) {
        throw validator.errors.map(error => {
            delete error.data
            return error
        })
    }
}

async function validateAllLists() {
    try {
        for (const listUrl of Object.values(spookyLists)) {
            await validate(listUrl);
            console.log(`Valid List: ${listUrl}`);
        }
    } catch (error) {
        console.error(error);
    }
}

validateAllLists();
