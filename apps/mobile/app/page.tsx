import { Button } from '@withbee/ui/button';
import { chooseParticipants } from '@withbee/apis';
import '@withbee/styles';

export default async function Home() {
  // const response = await chooseParticipants(1, 1, [1, 2, 3]);

  // console.log(response);

  return (
    <div>
      <h1>윗비트래블</h1>
      <div>모두들 화이팅 합시다!!</div>
      <Button label="기모철" />
    </div>
  );
}
