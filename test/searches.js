/* global describe, it */

const should = require('should')

const zapier = require('zapier-platform-core')
const nock = require('nock')

const App = require('../index')
const appTester = zapier.createAppTester(App)

zapier.tools.env.inject()

const { AUDIENCE, AUTH_BASE_URL } = process.env

const ACCESS_TOKEN_URL = AUTH_BASE_URL + '/oauth/token'

const {
  BASE_URL
} = require('../config')

describe('Searches', () => {
  describe('dynamic input field', () => {
    it('should show handle input field if v3 members API is slected', done => {
      const bundle = {
        inputData: {
          version: 'v3',
          api: 'members'
        }
      }
      appTester(App.searches.record.operation.inputFields, bundle)
        .then(fields => {
          fields.should.containDeep([{
            key: 'handle'
          }])
          done()
        })
    })

    it('should show path input field', done => {
      const bundle = {
        inputData: {}
      }
      appTester(App.searches.record.operation.inputFields, bundle)
        .then(fields => {
          fields.should.containDeep([{
            key: 'path'
          }])
          done()
        })
    })


    it('should show query param field', done => {
      const bundle = {
        inputData: {
          version: 'v5',
          api: 'jobs'
        }
      }
      appTester(App.searches.record.operation.inputFields, bundle)
        .then(fields => {
          fields.should.containDeep([{
            key: 'queryParam'
          }])
          done()
        })
    })
  })

  describe('members search', () => {
    it('should load member by handle', done => {
      const bundle = {
        inputData: {
          environment: 'Development',
          version: 'v3',
          api: 'members',
          handle: 'Ansary'
        }
      }

      const url = `${BASE_URL[bundle.inputData.environment]}/${bundle.inputData.version}`
      nock(url)
        .get(`/${bundle.inputData.api}/${bundle.inputData.handle}`)
        .reply(200, {
          id: '-7c672807:171d5810f01:-4f55',
          result: {
            success: true,
            status: 200,
            metadata: null,
            content: {
              maxRating: {
                rating: null,
                track: null,
                subTrack: null
              },
              userId: 22743661,
              firstName: 'F_NAME',
              lastName: 'L_NAME',
              description: null,
              otherLangName: 'NIAL',
              handle: 'Ansary',
              handleLower: 'ansary',
              status: 'ACTIVE',
              email: 'email@domain.com.z',
              emailVerifyTokenDate: '2020-05-03T03:17:15.218Z',
              newEmailVerifyTokenDate: '2020-05-03T03:17:15.218Z',
              addresses: [{
                streetAddr1: '123 Main Street',
                streetAddr2: 'address_2',
                city: 'Santa Clause',
                zip: '47579',
                stateCode: 'IN',
                type: 'HOME',
                updatedAt: null,
                createdAt: null,
                createdBy: null,
                updatedBy: null
              }],
              homeCountryCode: 'BGD',
              competitionCountryCode: 'BGD',
              photoURL: null,
              tracks: [
                'DEVELOP',
                'DATA_SCIENCE'
              ],
              createdAt: '2008-07-15T15:57:19.000Z',
              createdBy: '22743661',
              updatedAt: '2015-02-18T02:24:29.000Z',
              updatedBy: '22743661'
            }
          },
          version: 'v3'
        })

      appTester(App.searches.record.operation.perform, bundle)
        .then(results => {
          results.length.should.above(0)

          const firstMember = results[0]
          should.exist(firstMember.id)
          firstMember.userId.should.eql(22743661)

          done()
        })
        .catch(done)
    })
  })

  describe('challenges search', () => {
    it('should load challenges', done => {
      const bundle = {
        inputData: {
          environment: 'Development',
          version: 'v5',
          api: 'challenges'
        }
      }

      const url = `${BASE_URL[bundle.inputData.environment]}/${bundle.inputData.version}`
      nock(url)
        .get(`/${bundle.inputData.api}`)
        .reply(200, [{
          id: 'e64e8eca-f03c-4a77-a633-b35d74d7f471',
          legacyId: 30055483,
          legacy: {
            track: 'DESIGN',
            confidentialityType: 'public',
            directProjectId: 11269,
            reviewType: 'INTERNAL'
          },
          name: 'Demo challenge for selecting checkpoint winners',
          description: 'N/A',
          projectId: null,
          status: 'Draft',
          created: '2019-09-05T07:18:55.000Z',
          createdBy: '23274118',
          updated: '2020-03-18T06:04:31.000Z',
          updateBy: '23274118',
          timelineTemplateId: 'N/A',
          phases: [{
            id: '34fbf039-c057-46c8-bf3b-0e198c821f9e',
            duration: 259200,
            scheduledStartDate: '2019-09-06T09:00:00.000-0400',
            name: 'Registration',
            scheduledEndDate: '2019-09-09T13:00:00.000Z',
            phaseId: 'a93544bc-c165-4af4-b55e-18f3593b457a',
            isOpen: false
          },
          {
            id: 'a9672768-af97-49b1-80a9-6eabdbebc3a5',
            duration: 258900,
            scheduledStartDate: '2019-09-06T09:05:00.000-0400',
            name: 'Submission',
            scheduledEndDate: '2019-09-09T13:00:00.000Z',
            phaseId: '6950164f-3c5e-4bdc-abc8-22aaf5a1bd49',
            isOpen: false
          },
          {
            id: '27835aec-2a74-44f5-9c00-11c4bc57ac92',
            duration: 518400,
            scheduledStartDate: '2019-09-09T13:00:00.000-0400',
            name: 'Review',
            scheduledEndDate: '2019-09-15T17:00:00.000Z',
            phaseId: 'aa5a3f78-79e0-4bf7-93ff-b11e8f5b398b',
            isOpen: false
          }
          ],
          terms: [
            '82a35602-57c2-4b48-a9b9-b4e133b22035',
            '75d2f6bb-aadc-475e-9728-32c1dbd13655',
            'e0993b1a-abf7-45e6-8ed9-8cd0546be90b',
            'b11da5cd-713f-478d-90f4-f679ef53ee95'
          ],
          startDate: '2019-09-06T13:00:00.000Z',
          endDate: '2019-09-15T17:00:00.000Z',
          prizeSets: [{
            type: 'Challenge Prize',
            description: 'Challenge Prize',
            prizes: [{
              value: 1250,
              type: 'First Placement '
            },
            {
              value: 250,
              type: 'Second Placement'
            }
            ]
          }],
          tags: [],
          groups: [],
          winners: [],
          metadata: [{
            type: 'filetypes',
            value: '[""]'
          }],
          type: 'Web Design'
        }])

      appTester(App.searches.record.operation.perform, bundle)
        .then(results => {
          results.length.should.above(0)

          const firstSubmission = results[0]
          should.exist(firstSubmission.id)
          firstSubmission.name.should.eql('Demo challenge for selecting checkpoint winners')

          done()
        })
        .catch(done)
    })

    it('should load challenges and extract property', done => {
      const bundle = {
        inputData: {
          environment: 'Development',
          version: 'v5',
          path: '/e64e8eca-f03c-4a77-a633-b35d74d7f471',
          api: 'challenges',
          property: 'id'
        }
      }

      const url = `${BASE_URL[bundle.inputData.environment]}/${bundle.inputData.version}`
      nock(url)
        .get(`/${bundle.inputData.api}/e64e8eca-f03c-4a77-a633-b35d74d7f471`)
        .reply(200, [{
          id: 'e64e8eca-f03c-4a77-a633-b35d74d7f471',
          legacyId: 30055483,
          legacy: {
            track: 'DESIGN',
            confidentialityType: 'public',
            directProjectId: 11269,
            reviewType: 'INTERNAL'
          },
          name: 'Demo challenge for selecting checkpoint winners',
          description: 'N/A',
          projectId: null,
          status: 'Draft',
          created: '2019-09-05T07:18:55.000Z',
          createdBy: '23274118',
          updated: '2020-03-18T06:04:31.000Z',
          updateBy: '23274118',
          timelineTemplateId: 'N/A',
          phases: [{
            id: '34fbf039-c057-46c8-bf3b-0e198c821f9e',
            duration: 259200,
            scheduledStartDate: '2019-09-06T09:00:00.000-0400',
            name: 'Registration',
            scheduledEndDate: '2019-09-09T13:00:00.000Z',
            phaseId: 'a93544bc-c165-4af4-b55e-18f3593b457a',
            isOpen: false
          },
          {
            id: 'a9672768-af97-49b1-80a9-6eabdbebc3a5',
            duration: 258900,
            scheduledStartDate: '2019-09-06T09:05:00.000-0400',
            name: 'Submission',
            scheduledEndDate: '2019-09-09T13:00:00.000Z',
            phaseId: '6950164f-3c5e-4bdc-abc8-22aaf5a1bd49',
            isOpen: false
          },
          {
            id: '27835aec-2a74-44f5-9c00-11c4bc57ac92',
            duration: 518400,
            scheduledStartDate: '2019-09-09T13:00:00.000-0400',
            name: 'Review',
            scheduledEndDate: '2019-09-15T17:00:00.000Z',
            phaseId: 'aa5a3f78-79e0-4bf7-93ff-b11e8f5b398b',
            isOpen: false
          }
          ],
          terms: [
            '82a35602-57c2-4b48-a9b9-b4e133b22035',
            '75d2f6bb-aadc-475e-9728-32c1dbd13655',
            'e0993b1a-abf7-45e6-8ed9-8cd0546be90b',
            'b11da5cd-713f-478d-90f4-f679ef53ee95'
          ],
          startDate: '2019-09-06T13:00:00.000Z',
          endDate: '2019-09-15T17:00:00.000Z',
          prizeSets: [{
            type: 'Challenge Prize',
            description: 'Challenge Prize',
            prizes: [{
              value: 1250,
              type: 'First Placement '
            },
            {
              value: 250,
              type: 'Second Placement'
            }
            ]
          }],
          tags: [],
          groups: [],
          winners: [],
          metadata: [{
            type: 'filetypes',
            value: '[""]'
          }],
          type: 'Web Design'
        }])

      appTester(App.searches.record.operation.perform, bundle)
        .then(results => {
          results.length.should.above(0)

          const firstChallenge = results[0]
          firstChallenge.should.have.keys('id')
          firstChallenge.should.not.have.keys('legacy', 'name', 'legacyId')
          done()
        })
        .catch(done)
    })
  })

  describe('groups search with signed in users token', () => {
    it('should load groups', done => {
      const bundle = {
        inputData: {
          environment: 'Development',
          version: 'v5',
          api: 'groups'
        }
      }

      const url = `${BASE_URL[bundle.inputData.environment]}/${bundle.inputData.version}`
      nock(url)
        .get(`/${bundle.inputData.api}`)
        .reply(200, [{
          ssoId: '',
          updatedBy: '1',
          description: 'Test Group',
          privateGroup: true,
          oldId: '1',
          createdAt: '2017-05-18T10:29:38.000Z',
          selfRegister: false,
          createdBy: '1',
          domain: '',
          name: 'TestGroup',
          id: '304b042f-19f1-4d06-9788-104572eca795',
          status: 'active',
          updatedAt: '2017-05-18T10:29:38.000Z'
        }])

      appTester(App.searches.record.operation.perform, bundle)
        .then(results => {
          results.length.should.above(0)

          const firstGroup = results[0]
          should.exist(firstGroup.id)

          firstGroup.name.should.equal('TestGroup')

          done()
        })
        .catch(done)
    })

    it('should load groups and extract property', done => {
      const bundle = {
        inputData: {
          environment: 'Development',
          version: 'v5',
          api: 'groups',
          property: 'id'
        }
      }

      const url = `${BASE_URL[bundle.inputData.environment]}/${bundle.inputData.version}`
      nock(url)
        .get(`/${bundle.inputData.api}`)
        .reply(200, [{
          ssoId: '',
          updatedBy: '1',
          description: 'Test Group',
          privateGroup: true,
          oldId: '1',
          createdAt: '2017-05-18T10:29:38.000Z',
          selfRegister: false,
          createdBy: '1',
          domain: '',
          name: 'TestGroup',
          id: '304b042f-19f1-4d06-9788-104572eca795',
          status: 'active',
          updatedAt: '2017-05-18T10:29:38.000Z'
        }])

      appTester(App.searches.record.operation.perform, bundle)
        .then(results => {
          results.length.should.above(0)

          const firstGroup = results[0]

          firstGroup.should.have.keys('id')
          firstGroup.should.not.have.keys('description', 'name', 'status')

          done()
        })
        .catch(done)
    })
  })

  describe('users search with signed in users token', () => {
    it('should load users', done => {
      const bundle = {
        inputData: {
          environment: 'Development',
          version: 'v5',
          api: 'users',
          queryParam: JSON.stringify({
            handle: 'Ashlesha_Sa'
          }),
          property: 'id'
        }
      }

      const url = `${BASE_URL[bundle.inputData.environment]}/${bundle.inputData.version}`
      nock(url)
        .get(`/${bundle.inputData.api}`)
        .query(JSON.parse(bundle.inputData.queryParam))
        .reply(200, [{
          lastName: 'Satpute',
          firstName: 'Ashlesha',
          updatedBy: null,
          createdBy: 'TonyJ',
          created: '2020-10-23T15:33:40.887Z',
          handle: 'Ashlesha_Sa',
          id: '07530d95-0780-4c9a-b4a7-9fd9821c89cb',
          updated: null
        }])

      appTester(App.searches.record.operation.perform, bundle)
        .then(results => {
          results.length.should.above(0)

          const firstUser = results[0]

          firstUser.should.have.keys('id')
          firstUser.should.not.have.keys('handle', 'firstName', 'lastName')

          done()
        })
        .catch(done)
    })
  })

  describe('jobs search with signed in users token', () => {
    it('should load jobs', done => {
      const bundle = {
        inputData: {
          environment: 'Development',
          version: 'v5',
          api: 'jobs',
          queryParam: JSON.stringify({
            externalId: '41929904'
          }),
          property: 'id'
        }
      }

      const url = `${BASE_URL[bundle.inputData.environment]}/${bundle.inputData.version}`
      nock(url)
        .get(`/${bundle.inputData.api}`)
        .query(JSON.parse(bundle.inputData.queryParam))
        .reply(200, [{
          projectId: 16745,
          externalId: '41929904',
          description: 'Designer',
          startDate: '2020-12-07T11:52:00.337Z',
          endDate: '2021-01-07T11:52:00.337Z',
          skills: [
            '13dda8dc-4c34-4751-bbab-aab76d757cbb'
          ],
          numPositions: 1,
          resourceType: 'desiger',
          rateType: 'hourly',
          workload: 'full-time',
          createdAt: '2020-12-07T11:52:00.696Z',
          createdBy: 'a55fe1bc-1754-45fa-9adc-cf3d6d7c377a',
          status: 'sourcing',
          updatedBy: '3f64739e-10bf-42ca-8314-8aea0245cd0f',
          updatedAt: '2020-12-19T00:55:01.730Z',
          id: 'ecc24a25-f1e0-4d77-ac0b-5eb44a27e632'
        }])

      appTester(App.searches.record.operation.perform, bundle)
        .then(results => {
          results.length.should.above(0)

          const firstUser = results[0]

          firstUser.should.have.keys('id')
          firstUser.should.not.have.keys('externalId')

          done()
        })
        .catch(done)
    })
  })

  describe('submissions search', () => {
    it('should load submissions', done => {
      const bundle = {
        inputData: {
          environment: 'Development',
          version: 'v5',
          api: 'submissions'
        }
      }

      const url = `${BASE_URL[bundle.inputData.environment]}/${bundle.inputData.version}`
      nock(url)
        .get(`/${bundle.inputData.api}`)
        .reply(200, [{
          updatedBy: 'dan_developer',
          created: '2020-04-27T04:48:53.153Z',
          legacySubmissionId: 209275,
          isFileSubmission: false,
          type: 'Contest Submission',
          url: 'https://s3.amazonaws.com/topcoder-dev-submissions/9eb26522-d6dd-4c76-80e3-f2308303c796.zip',
          challengeId: 30052924,
          createdBy: 'dan_developer',
          review: [{
            score: 100,
            updatedBy: 'MeaSS8yPG4VIer4XalVqOAYhnCNecGfN@clients',
            reviewerId: '4cce09cd-e01b-451a-b472-bb01f79b3e72',
            submissionId: '9eb26522-d6dd-4c76-80e3-f2308303c796',
            createdBy: 'MeaSS8yPG4VIer4XalVqOAYhnCNecGfN@clients',
            created: '2020-04-27T04:49:07.302Z',
            scoreCardId: 47244873,
            typeId: 'd96d5f17-5884-47b8-bfea-bddf066e451f',
            id: 'cc804bdb-46b5-453f-8740-20528c934b7b',
            updated: '2020-04-27T04:49:07.302Z',
            status: 'completed'
          },
          {
            score: 100,
            updatedBy: 'maE2maBSv9fRVHjSlC31LFZSq6VhhZqC@clients',
            reviewerId: '0e329097-2f15-4686-b78a-531db57a9b2f',
            submissionId: '9eb26522-d6dd-4c76-80e3-f2308303c796',
            createdBy: 'maE2maBSv9fRVHjSlC31LFZSq6VhhZqC@clients',
            created: '2020-04-27T04:48:58.841Z',
            scoreCardId: 30001850,
            typeId: '68c5a381-c8ab-48af-92a7-7a869a4ee6c3',
            id: '2b3a0ad7-a08e-4dc6-bfaa-f919c1653292',
            updated: '2020-04-27T04:48:58.841Z',
            status: 'completed'
          }
          ],
          id: '9eb26522-d6dd-4c76-80e3-f2308303c796',
          submissionPhaseId: 753869,
          updated: '2020-04-27T04:48:53.153Z',
          fileType: 'zip',
          memberId: 40152905
        }])

      appTester(App.searches.record.operation.perform, bundle)
        .then(results => {
          results.length.should.above(0)

          const firstChallenge = results[0]
          should.exist(firstChallenge.id)

          done()
        })
        .catch(done)
    })
  })
})
