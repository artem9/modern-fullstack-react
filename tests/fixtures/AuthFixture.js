export class AuthFixture {
  constructor(page) {
    this.page = page
  }

  async signUpAndLogin() {
    const testUser = 'test' + Date.now()
    await this.page.goto('/signup')
    await this.page.getByRole('textbox', { name: 'Username:' }).click()
    await this.page.getByRole('textbox', { name: 'Username:' }).fill(testUser)
    await this.page.getByRole('textbox', { name: 'Password:' }).click()
    await this.page.getByRole('textbox', { name: 'Password:' }).fill('test')
    await this.page.getByRole('button', { name: 'Sign Up' }).click()
    await this.page.waitForURL('**/login')
    await this.page.getByRole('textbox', { name: 'Username:' }).click()
    await this.page.getByRole('textbox', { name: 'Username:' }).fill(testUser)
    await this.page.getByRole('textbox', { name: 'Password:' }).click()
    await this.page.getByRole('textbox', { name: 'Password:' }).fill('test')
    await this.page.getByRole('button', { name: 'Log In' }).click()
    await this.page.waitForURL('**/')
    return testUser
  }
}
