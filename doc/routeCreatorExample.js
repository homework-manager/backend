{
  reqRequirements: {
    exampleData: {
      required: true, // defaults to false
      type: String, // doesn't check if not defined
      regExp: /{1,20}/ // doesn't check if not defined
    }
  },
  async handler (body) {
    return {
      privateDataThatContainsPublicData: {
        private: 'pass',
        public: 'user'
      }
    }
  },
  data: { // variables = what handler returns
    async example (body, variables, previousData) {
      return variables.privateDataThatContainsPublicData.public
    },
    statusCode (body, variables, previousData) {
      return previousData.error === undefined ? 400 : 200
    }
  }
}
