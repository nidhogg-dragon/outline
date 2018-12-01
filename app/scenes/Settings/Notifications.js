// @flow
import * as React from 'react';
import { debounce } from 'lodash';
import { observer, inject } from 'mobx-react';
import CenteredContent from 'components/CenteredContent';
import PageTitle from 'components/PageTitle';
import HelpText from 'components/HelpText';
import NotificationListItem from './components/NotificationListItem';

import UiStore from 'stores/UiStore';
import NotificationSettingsStore from 'stores/NotificationSettingsStore';

type Props = {
  ui: UiStore,
  notificationSettings: NotificationSettingsStore,
};

const options = [
  {
    event: 'documents.publish',
    title: 'Document published',
    description: 'Receive a notification whenever a new document is published',
  },
  {
    event: 'documents.update',
    title: 'Document updated',
    description: 'Receive a notification when a document you created is edited',
  },
  {
    event: 'collections.create',
    title: 'Collection created',
    description: 'Receive a notification whenever a new collection is created',
  },
  {
    event: 'summary.daily',
    title: 'Daily summary',
    description: 'Receive a daily summary of changes',
  },
  {
    event: 'summary.weekly',
    title: 'Weekly summary',
    description: 'Receive a weekly summary of changes',
  },
];

@observer
class Notifications extends React.Component<Props> {
  componentDidMount() {
    this.props.notificationSettings.fetchPage();
  }

  handleChange = async (ev: SyntheticInputEvent<*>) => {
    const { notificationSettings } = this.props;
    const setting = notificationSettings.getByEvent(ev.target.name);

    if (ev.target.checked) {
      await notificationSettings.save({
        event: ev.target.name,
      });
    } else if (setting) {
      await notificationSettings.delete(setting);
    }

    this.showSuccessMessage();
  };

  showSuccessMessage = debounce(() => {
    this.props.ui.showToast('Notifications updated');
  }, 1000);

  render() {
    const { notificationSettings } = this.props;

    return (
      <CenteredContent>
        <PageTitle title="Notifications" />
        <h1>Notifications</h1>

        <HelpText>
          Manage when you receive email notifications from Outline.
        </HelpText>

        {options.map(option => {
          const setting = notificationSettings.getByEvent(option.event);

          return (
            <NotificationListItem
              key={option.event}
              onChange={this.handleChange}
              setting={setting}
              disabled={setting ? setting.isSaving : false}
              {...option}
            />
          );
        })}
      </CenteredContent>
    );
  }
}

export default inject('notificationSettings', 'ui')(Notifications);
