# Topcoder APIs and Zapier integration

## Dependencies

- nodejs https://nodejs.org/en/ (v8)
- Zapier CLI
- Zapier

## Configuration

Configuration for the app is at `config.js`.
- BASE_URL.Development the base url for TC API DEV instance
- BASE_URL.QA the base url for TC API QA instance
- BASE_URL.Production the base url for TC API Prod instance

## Zapier CLI Setup
Please refer [Install the Zapier CLI](https://zapier.com/developer/start/install-the-zapier-cli) and [Run Zapier Login](https://zapier.com/developer/start/run-zapier-login). You need to install Zapier CLI in order to use it deploy the integration.

## Zapier Integration Deployment
1. Run the following command to install the dependencies
```
npm install
```

2. To run linters if required
```
npm run lint
```
To fix possible lint errors:
```
npm run lint:fix
```

3. Deploy the integration, you need to enter the Zapier integration app name in prompt dialog
```
zapier push
```

4. Invite yourself so you can use this integration during making a Zap, you need to use your Zapier account's email
```
zapier invite XXX@XXX.XXXX
```

5. You would received an email sent by Zapier having a link. Clicking the link will open the page for confirmation, click the orange accept button. Now run command:
```
zapier invite
```
And you would find the status of your account is `accepted`

## Verification
1. Trigger positive scenario demo video:
https://drive.google.com/open?id=1RnvyV0b5FuAg35lIEqdTl7kHqkQ2zsMn
2. Trigger negative scenario demo video:
https://drive.google.com/open?id=1TGK34J7a2iIEIVQSuTDQKXFvGJb_FYBE
3. Create action demo video:
https://drive.google.com/open?id=1AxhaLzK48Ah9bTtHoSCjpVLSJr_lQU-0
4. Search action demo video:
https://drive.google.com/open?id=1lm9X8s3Qxw6QAa58twFygCXcRTj-QVm2

## Note
We need to catch the error in trigger, otherwise the Zap would be forced to stop if we encounter error. It is a litter difference with create/search actions' error handling. Check `triggers/record.js` Line53 - Line56
